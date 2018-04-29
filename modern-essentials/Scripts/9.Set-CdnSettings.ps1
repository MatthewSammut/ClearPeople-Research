if($currentDirectory -eq $null) { $currentDirectory = Split-Path $MyInvocation.MyCommand.Path }
$setConstants = $currentDirectory + "\0.Set-Constants.ps1"
$setVariables = $currentDirectory + "\0.Set-Variables.ps1"

. $setConstants
. $setVariables

Write-Host "Adding Document library to store CDN Assets..." -NoNewline
Connect-PnPOnline -Url $SiteUrl -Credentials $cred
$list = Get-PnPList -Identity $Library
if ($list -eq $null) {
    New-PnPList -Title $Library -Template 101 | out-null
    Write-Host " added succesfully" -ForegroundColor Green    
}
Write-Host " already existed" -ForegroundColor Green

Connect-SPOService -Url $TenantAdminUrl -Credential $cred
Write-Host "Enabling CDN on Tenant..." -NoNewline
Set-SPOTenantCdnEnabled -CdnType Both -Enable:$false -Confirm:$false | out-null
Write-Host " enabled" -ForegroundColor Green

Write-Host "Configuring Library as CDN..." -NoNewline
Remove-SPOTenantCdnOrigin -CdnType $cdnType -OriginUrl $originUrl -Confirm:$false | out-null
Write-Host " done" -ForegroundColor Green

Write-Host "Uploading required files to the CDN..." -NoNewline
#Apply-PnPProvisioningTemplate -Path $currentDirectory"\PnpTemplates\KF.BrandingSolution.Deployment.CDN.Files.xml"
Write-Host " done" -ForegroundColor Green