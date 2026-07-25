Option Explicit

Dim shell, files, projectFolder, startupScript, powershellPath, command
Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")

projectFolder = files.GetParentFolderName(WScript.ScriptFullName)
startupScript = files.BuildPath(projectFolder, "course-host-startup.ps1")
powershellPath = shell.ExpandEnvironmentStrings("%SystemRoot%") & "\System32\WindowsPowerShell\v1.0\powershell.exe"

If files.FileExists(startupScript) Then
  command = Chr(34) & powershellPath & Chr(34) & " -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File " & Chr(34) & startupScript & Chr(34)
  shell.Run command, 0, False
End If
