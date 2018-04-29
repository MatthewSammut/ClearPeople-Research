if($currentDirectory -eq $null) { $currentDirectory = Split-Path $MyInvocation.MyCommand.Path }
$setConstants = $currentDirectory + "\0.Set-Constants.ps1"
$setVariables = $currentDirectory + "\0.Set-Variables.ps1"
. $setConstants
. $setVariables

if ($tenantAdminUrl -eq ''){
    $tenantAdminUrl = Read-Host -Prompt 'Input the tenant admin url'
}
if ($tenantUserName -eq ''){
    $tenantUserName = Read-Host -Prompt 'Input the tenant admin username'
}
if ($tenantPassword -eq ''){
    $tenantPassword = Read-Host -Prompt 'Input the tenant admin password'
}

$password = ConvertTo-SecureString $tenantPassword -AsPlainText -Force;
$tenantCred = New-object -typename System.Management.Automation.PSCredential -argumentlist $tenantUserName, $password

Write-Host "Connecting to Tenant..." 
Connect-PnPOnline -Url $tenantAdminUrl -Credentials $tenantCred


#Upload Branding spfx solution
$existingApp = Get-PnPApp | Where-Object {$_.Title -eq $spfxSolution}
if ($existingApp)
{
    Add-PnPApp -Path $currentDirectory"\..\sharepoint\Solution\$spfxSolution.sppkg" -Overwrite
    Write-Host "Publishing App into App Catalog ..." 
    Publish-PnPApp -Identity $existingApp.Id -SkipFeatureDeployment
}
else
{
    Write-Host "Adding App to App Catalog ..." 
    Add-PnPApp -Path $currentDirectory"\..\sharepoint\Solution\$spfxSolution.sppkg"
    $newApp = Get-PnPApp | Where-Object {$_.Title -eq $spfxSolution}
    if ($newApp){

        Write-Host "Publishing App into App Catalog ..." 
        Publish-PnPApp -Identity $newApp.Id -SkipFeatureDeployment
    }
}
