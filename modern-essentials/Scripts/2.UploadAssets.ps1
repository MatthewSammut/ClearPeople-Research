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
if ($siteUrlSourceBrandingFiles -eq ''){
    $siteUrlSourceBrandingFiles = Read-Host -Prompt 'Input the site url where the source files will be saved'
}

$password = ConvertTo-SecureString $tenantPassword -AsPlainText -Force;
$cred = New-object -typename System.Management.Automation.PSCredential -argumentlist $tenantUserName, $password;
Connect-PnPOnline -Url $siteUrl -Credentials $cred;

$web = Get-PnPWeb -Identity $webUrl;
$list = Get-PnPList -Web $web  -Identity $libraryTitle;
if($list) {

    Write-Host "Document Library already existed" -ForegroundColor Green
   
} else {

    Write-Host "Adding Document Library to store SPFx Assets..."
    New-PnPList -Title $libraryTitle -Url $libraryUrl -Template 101 | out-null
    Write-Host "Document Library added succesfully" -ForegroundColor Green  
}

Connect-SPOService -Url $tenantAdminUrl -Credential $cred
Write-Host "Uploading required files to the CDN..." -NoNewline
Apply-PnPProvisioningTemplate -Path $currentDirectory"\..\PnPTemplates\CP.SPFx.Deployment.Solution.Files.xml"
Write-Host " done" -ForegroundColor Green