if($currentDirectory -eq $null) { $currentDirectory = Split-Path $MyInvocation.MyCommand.Path }
$setConstants = $currentDirectory + "\0.Set-Constants.ps1"
$setVariables = $currentDirectory + "\0.Set-Variables.ps1"
. $setConstants
. $setVariables

$currentDirectory;

#Upload SPFx solution to the app catalog
$UploadSolutionToAppCatalog = $currentDirectory + "\1.UploadSolutionToAppCatalog.ps1"
. $UploadSolutionToAppCatalog

#Upload dependency asset files to the SP library in root site collection
$UploadAssets = $currentDirectory + "\2.UploadAssets.ps1"
. $UploadAssets 

#Enable and configure the Custom Action on the required site collections
$DeployCustomisatonSolution = $currentDirectory + "\3.DeployCustomisationSolution.ps1"
. $DeployCustomisatonSolution 