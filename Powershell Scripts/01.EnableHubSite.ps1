$currentDirectory = [System.IO.Path]::GetDirectoryName($MyInvocation.InvocationName)
$setConstants = $currentDirectory + "\00.Set-Constants.ps1"
$setVariables = $currentDirectory + "\00.Set-Variables.ps1"
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

$connection = Connect-PnPOnline -Url $siteUrl -Credentials $tenantCred

#Register-PnPHubSite -Site $hubSiteUrl

$hubSite = Get-PnPHubSite -Connection $connection
$hubSite; 


#Grant-PnPHubSiteRights
#Get-PnPContentTypePublishingHubUrl [-Connection <SPOnlineConnection>]