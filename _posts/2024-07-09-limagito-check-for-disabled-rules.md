---
layout: post
date: 2024-07-09 00:00
title:  "Limagito Rule to check for recently disabled rules using Pascal"
category: blogs
tags: Pascal
---
I am writing this post to help the one other poor soul stuck using this technology. Limagito is a job scheduler/file mover/general purpose scripting engine. At work we recently ran into the issue where we have hundreds of rules and it was impossible to tell when a rule was disabled (which you have to do to edit or inspect rules) and admins forgot to re-enable the rule after. I looked into normal ways to check for this but didn't find anything so here is my hacked together Pascal solution that calls Powershell:


Pascal Script
------------
```pascal
Var
  tmpInfo: String;
  tmpList: TStringList;
  tmpEmailRuleInfo: String;
  tmpEmailRuleFile: String;
  tmpEmailRuleList: TStringList;
Const
  ctNewFileName = 'Current_Disabled_Rules.txt';
  ctOldFileName = 'Old_Disabled_Rules.txt';
  ctOutFileName = 'RulesFound.txt';
  ctWorkingDir = 'C:\Limagito Scripts\Check Disabled Rules\';
Begin
  // Init Var
  psClearSourceFiles; // Clear SourceFiles Listing
  psExitCode:= 1;

  // We'll use a TStringList that we'll fill with Disabled Rules Data
  tmpList := TStringList.Create;

  Try
    Try
      // Function psGetDisabledRuleList(Const aIncGroupname,
      // aIncRuleName, aIncRuleID: Boolean; Const aDelimiter, aQuoteChar: Char): String;
      // Request for All Disabled Rules using Tab(#44) COMMA as Delimiter
      // Include Groupname, RuleName and RuleID
      tmpInfo := psGetDisabledRuleList(True, True, False, #44, #0);

    // Clean up old files
    If FileExists(ctWorkingDir + ctOldFileName) Then
      Begin
      DeleteFile(ctWorkingDir + ctOldFileName);
      End;

    If FileExists(ctWorkingDir + ctOutFileName) Then
      Begin
      DeleteFile(ctWorkingDir + ctOutFileName);
      End;

    If FileExists(ctWorkingDir + ctNewFileName) Then
      Begin
      RenameFile(ctWorkingDir + ctNewFileName,ctWorkingDir + ctOldFileName);
      End;



      If tmpInfo <> '' Then
      Begin
    // Add to List
        tmpList.add(tmpInfo);

        // Save List To File
        tmpList.SaveToFile(ctWorkingDir + ctNewFileName);

        // Add To SourceFiles List
        psAddToSourceFiles(ctWorkingDir + ctNewFileName);

    //Run Powershell script to check if anything changed
    psCreateProcess('C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe','powershell.exe .\DiffTest.ps1','C:\Limagito Scripts\Check Disabled Rules\',1,True);

  If FileExists(ctWorkingDir + ctOutFileName) Then
    Begin
    // Set rule variable for Email
    tmpEmailRuleFile := ctWorkingDir + ctOutFileName;
    tmpEmailRuleList := TStringList.Create;
    tmpEmailRuleList.LoadFromFile(tmpEmailRuleFile);
    psVSB := tmpEmailRuleList.Text;

    // Log that we found a new rule and exit
    psLogWrite(1, '', 'New Disabled Rules found:' + psVSB);
    psExitCode := 0;
    End;

      End;
    Except
      psLogWrite(1, '', 'Save File ' + ctWorkingDir + ctNewFileName + ' Exception');
    End;
  Finally
    //tmpList.Free;
  //tmpEmailRuleList.Free;
  End;
End.
```

Powershell Script (On server)
------------
```powershell
$diffcheck = Compare-Object $(Get-content Current_Disabled_Rules.txt) $(Get-Content Old_Disabled_Rules.txt) | ?{$_.SideIndicator -eq '<='} | select -ExpandProperty inputobject  
if ($diffcheck -ne $null){  
	Write-Output "New Rule Found: '$diffcheck'"
	$diffcheck | Out-File RulesFound.txt	 	
}
```

Alert
------------
If you want it to email you when it finds a newly disabled rule then this is the template I used:

```js
[ Email ]
- Use Common SMTP
- From: limagito@sample.org
- To: distrolist@sample.org
- Subject: Rule(s) were recently disabled - Warning
- Body:
The following Limagito rule(s) were recently disabled:

%VSB

Please verify that these changes are correct.
- Priority: Normal
- CharSet: iso-8859-1
```
