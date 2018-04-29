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

#Add or Update Tenant Theme
#$tenantThemeName = "Custom Company Theme";
#$tenantTheme = Add-PnPTenantTheme -Identity $tenantThemeName -IsInverted $true -Palette $SampleCustomThemeSample -Overwrite -Connection $connection;
#$tenantTheme = Get-PnPTenantTheme -Name $tenantThemeName;
#$tenantTheme;

#Read and Add Site Script - Apply Custom Theme
$siteScriptJson = Get-Content ($currentDirectory + "\..\site-design\applyCompanyTheme.json") | ConvertFrom-Json;
$siteScript = Get-PnPSiteScript -Connection $connection | where {$_.Title -eq $siteScriptName};
if($siteScript -eq $null) {
     'Adding pnp site script...';
     $siteScript = Add-PnPSiteScript -Title $siteScriptJson.Name -Content (ConvertTo-Json $siteScriptJson.Content) -Description $siteScriptJson.Description -Connection $connection
     
}
else {
    'Updating PNP site script...';
    Set-PnPSiteScript -Identity $siteScript.Id -Content (ConvertTo-Json $siteScriptJson.Content) -Connection $connection -Confirm;
}
$siteScript;

#Select scripts to include in template - 1. apply custom theme
$Script_CustomSiteScript =  Get-PnPSiteScript -Connection $connection | where {$_.Title -eq $siteScriptName};

#Add or Update Site Template - Include Scripts above
$siteDesignName = "My New Site Template";
$siteDesignDesciption = "My New Site Template is used for Awesome stuff";
$siteDesign = Get-PnPSiteDesign -Connection $connection | where {$_.Title -eq $siteDesignName};
if($siteDesign-eq $null) {
    'Adding PNP Site Template'
    $siteDesign = Add-PnPSiteDesign -Title $siteDesignName -Description $siteDesignDesciption -WebTemplate CommunicationSite -SiteScriptIds $Script_CustomSiteScript.Id;
}
else {
    'Updating PNP Site Template...'
    Set-PnPSiteDesign -Identity $siteDesign.Id -Connection $connection -SiteScriptIds $Script_CustomSiteScript.Id;
}


#Finally Apply Site Design
Invoke-PnPSiteDesign -Identity $siteDesign.Id -WebUrl $siteUrl

#Get-PnPSiteDesign












#------

#$siteScriptName = "Custom Site Script";
#$siteScriptDescription = "Custom Site Script Description";
#$siteScriptContent = Get-Content ($currentDirectory + "\..\site-design\applyCompanyTheme.json") -Raw 
#$siteScript = Get-PnPSiteScript -Connection $connection | where {$_.Title -eq $siteScriptName};
#if($siteScript -eq $null) {
#     'Adding pnp site script...';
#     $siteScript = Add-PnPSiteScript -Title $siteScriptName  -Content $siteScriptContent -Description $siteScriptDescription -Connection $connection
#     
#}
#else {
#    'pnp site script already exists...';
#}
#$siteScript;

#----
#what next ?

#Add-SPOSiteDesign -Title "Contoso customer tracking" -WebTemplate "64" -SiteScripts "<ID>" -Description "Tracks key customer data in a list"
#Add-PnPSiteScript -Title "Custom Company Theme" -Content $siteDesignScript -Connection $Connection
#Grant-SPOSiteDesignRights   #44252d09-62c4-4913-9eb0-a2a8b8d7f863 -Principals "admin@matthewsammut.onmicrosoft.com" -Rights View
#Add-PnPTenantTheme -Connection $connection -Identity "Organisation Custom Theme Sample" -Palette $SampleCustomThemeSample -IsInverted $false -Overwrite 
#Add-SPOSiteDesign -Title "Contoso customer tracking" -WebTemplate "64" -SiteScripts "2756067f-d818-4933-a514-2a2b2c50fb06" -Description "Creates customer list and applies standard theme"


Function DeleteAllSiteScripts() {
    Get-PnPSiteScript | %{
        Remove-PnPSiteScript -Identity $_.Id -Force;
    }
}
Function DeleteAllTenantThemes() {
    Get-PnPTenantTheme | %{
        Remove-PnPTenantTheme -Identity $_.Name
    }
}
Function DeleteAllSiteDesigns() {
    Get-PnPSiteDesign| %{
        Remove-PnPSiteDesign -Identity $_.Id -Force
    }
}
#DeleteAllSiteScripts;
#DeleteAllTenantThemes;
#DeleteAllSiteDesigns;
