Set officeShell = CreateObject("WScript.Shell")
Set officeFiles = CreateObject("Scripting.FileSystemObject")
officeRoot = officeFiles.GetParentFolderName(WScript.ScriptFullName)
officeShell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & officeRoot & "\scripts\start-office.ps1""", 0, False
