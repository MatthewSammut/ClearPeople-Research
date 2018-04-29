if($currentDirectory -eq 'null') { $currentDirectory = [System.IO.Path]::GetDirectoryName($MyInvocation.InvocationName) }

#Branding CDN 
$originUrl = "tenantassets";
$cdnType = "Public";
$libraryTitle = "Tenant Assets";
$libraryUrl = "tenantassets"
$webUrl = "/";
$siteUrl = "https://matthewsammut.sharepoint.com/";

#Branding Community site
# -- Property Bags -> Don't change, used on the SPFx solution
#$pbSiteUrlName = "KFBruceSiteUrl";
#$pbNavTermSetName = "KFBruceNavTermSet";

# details of custom action/SPFx extension -> Don't change
[guid]$spfxExtension_GlobalHeaderID = "b1efedb9-b371-4f5c-a90f-3742d1842cf3"
[string]$spfxExtName = "cp-modern-essentials-application-customizer"
[string]$spfxExtTitle = "cp-modern-essentials-application-customizer"
[string]$spfxExtGroup = "CP Modern Essentials"
[string]$spfxExtDescription = "Modern Essentials Applications Customizer"
[string]$spfxExtLocation = "ClientSideExtension.ApplicationCustomizer"
[string]$spfxSolution = "cp-modern-essentials-application-customizer";
[string]$spfxProperties =  "$(get-content $currentDirectory'../../config/component-properties.json')"
