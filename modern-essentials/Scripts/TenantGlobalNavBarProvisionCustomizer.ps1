$secpasswd = ConvertTo-SecureString "Qweid!snqiw0" -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential ("admin@matthewsammut.onmicrosoft.com", $secpasswd)

#Connect-PnPOnline "https://matthewsammut.sharepoint.com/sites/MyNewCommunicationSite" -Credentials $credentials
Connect-PnPOnline "https://matthewsammut.sharepoint.com/sites/ModernEssentials" -Credentials $mycreds

$context = Get-PnPContext
$site = Get-PnPSite
$context.Load($site)
Invoke-PnPQuery

$ca = $site.UserCustomActions;
$context.Load($ca)
Invoke-PnPQuery

$ca | Format-List *;

$web = Get-PnPWeb
$context.Load($web)
Invoke-PnPQuery

$ca = $web.UserCustomActions;
$context.Load($ca)
Invoke-PnPQuery

$ca | Format-List *;

$IdsForDeletion = New-Object System.Collections.ArrayList;
$ca | %{
    if($_.Title -eq "CPModernEssentialsApplicationCustomizer") {
    #if($_.Title -eq "TenantGlobalNavBarCustomAction") {
     $IdsForDeletion.Add($_.Id);
    }
}

$IdsForDeletion | %{

    $currentCA = $ca.GetById($_)
    #$currentCA.DeleteObject();
    #Invoke-PnPQuery
}

#$ca = $site.UserCustomActions.Add()
#$ca.ClientSideComponentId = "b1efedb9-b371-4f5c-a90f-3742d1842cf3"
#$ca.ClientSideComponentProperties = "{""TopMenuTermSet"":""Top Global Navigation"",""BottomMenuTermSet"":""Bottom Global Navigation""}"
#$ca.Location = "ClientSideExtension.ApplicationCustomizer"
#$ca.Name = "CPModernSitesCustomisationsAppCustomizer"
#$ca.Title = "CPModernSitesCustomisationsAppCustomizer"
#$ca.Description = "Custom action for Tenant Global NavBar Application Customizer"
#$ca.Update()
#Execute-PnPQuery


#$updatedCA = $ca[0];
#$updatedCA | Format-List *