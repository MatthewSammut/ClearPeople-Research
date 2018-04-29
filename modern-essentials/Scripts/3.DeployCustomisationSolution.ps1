$currentDirectory = [System.IO.Path]::GetDirectoryName($MyInvocation.InvocationName)
$setConstants = $currentDirectory + "\0.Set-Constants.ps1"
$setVariables = $currentDirectory + "\0.Set-Variables.ps1"
. $setConstants
. $setVariables

$ActionToPerform = '0';

if ($tenantAdminUrl -eq ''){
    $tenantAdminUrl = Read-Host -Prompt 'Input the tenant admin url'
}
if ($tenantUserName -eq ''){
    $tenantUserName = Read-Host -Prompt 'Input the tenant admin username'
}
if ($tenantPassword -eq ''){
    $tenantPassword = Read-Host -Prompt 'Input the tenant admin password'
}
if ($OriginScopesUrl -eq ''){
    $OriginScopesUrl = Read-Host -Prompt 'Input the url of your site collection from we will get the search scopes, e.g. https://kornferry.sharepoint.com/sites/kfdw'
}
if ($OriginNavTermSetName -eq ''){
    $OriginNavTermSetName = Read-Host -Prompt "The term set name used to build the main mega menu, e.g. 'Global Navigation'"
}
if ($ActionToPerform -eq '')
{
    $ActionToPerform = Read-Host -Prompt "The Action to perform, write 0 in case you want to Add the SPFx Extension to the sitecollection, write 1 if you want to remove it. [0: Add / Update Extension, 1: Remove Extension]"
}

$password = ConvertTo-SecureString $tenantPassword -AsPlainText -Force;
$tenantCred = New-object -typename System.Management.Automation.PSCredential -argumentlist $tenantUserName, $password


# -- start functions --
function Add-CustomActionForSPFxExt ([string]$url, [Microsoft.SharePoint.Client.ClientContext]$clientContext) {
	Write-Output "-- About to add custom action to: $url"
    Add-PnPCustomAction -Name $spfxExtName -Title $spfxExtTitle -Location $spfxExtLocation -ClientSideComponentId $spfxExtension_GlobalHeaderID -ClientSideComponentProperties $spfxProperties
        
	Write-Output "-- Successfully added extension" 	
	
	Write-Output "Processed: $url"
}

function Remove-CustomActionForSPFxExt ([string]$extensionName, [string]$url, [Microsoft.SharePoint.Client.ClientContext]$clientContext) {
	Write-Output "-- About to remove custom action with name '$($extensionName)' from: $url"

	$actionsToRemove = Get-PnPCustomAction -Web $clientContext.Web | Where-Object {$_.Location -eq "ClientSideExtension.ApplicationCustomizer" -and $_.Name -eq $extensionName }
	Write-Output "-- Found $($actionsToRemove.Count) extensions with name $extensionName on this web." 	
	foreach($action in $actionsToRemove)
	{
		Remove-PnPCustomAction -Identity $action.Id
		Write-Output "-- Successfully removed extension $extensionName from web $url." 	
	}

	Write-Output "-- Processed: $url"
}

function Update-CustomActionForSPFxExt ([string]$extensionName, [string]$url, [Microsoft.SharePoint.Client.ClientContext]$clientContext) {
	Write-Output "-- About to update custom action with name '$($extensionName)' from: $url"

	$actionsToUpdate = Get-PnPCustomAction -Web $clientContext.Web | Where-Object {$_.Location -eq "ClientSideExtension.ApplicationCustomizer" -and $_.Name -eq $extensionName }
	Write-Output "-- Found $($actionsToUpdate.Count) extensions with name $extensionName on this web." 	
	foreach($action in $actionsToUpdate)
	{
		$ca = Get-PnPCustomAction -Identity $action.Id

        
        $ca.ClientSideComponentId = $spfxExtension_GlobalHeaderID
        $ca.ClientSideComponentProperties = $spfxProperties
        $ca.Location = $spfxExtLocation
        $ca.Name = $spfxExtName
        $ca.Title = $spfxExtTitle
        $ca.Description = $spfxExtDescription
        $ca.Update()
		Invoke-PnPQuery

        Write-Output "-- Successfully updated extension $extensionName from web $url." 	
	}

	Write-Output "-- Processed: $url"
}

function IfThemeExists($ctx,$list,$themeName)
{
  $caml="<View><Query><Where><Eq><FieldRef Name='Name' /><Value Type='Text'>$themeName</Value></Eq></Where></Query></View>";
  $cquery = New-Object Microsoft.SharePoint.Client.CamlQuery
  $cquery.ViewXml=$caml    
  $listItems = $list.GetItems($cquery)
  $ctx.Load($listItems)
  $ctx.ExecuteQuery()
  if($listItems.Count -gt 0)
  { 
    return $true;
  }
  else
  {
    return $false;
  }
}

function Create-ComposeLook($web, [string]$colorFilePath, [string]$fontFilePath, [string] $themeName)
{
    $spcontext = $web.Context;

    ## get the composite look gallery to create composed look
    $themesOverviewList = $web.GetCatalog(124);

    $spcontext.Load($themesOverviewList);
    $spcontext.ExecuteQuery();

    ## Do not add duplicate, if the theme is already there
    ##TODO
    if ((IfThemeExists -ctx $spcontext -list $themesOverviewList -themeName $themeName) -eq $false)
    {
        ## Create new theme entry. 
        $itemInfo  = New-Object Microsoft.SharePoint.Client.ListItemCreationInformation
        $item = $themesOverviewList.AddItem($itemInfo)
        $item["Name"] = $themeName;
        $item["Title"] = $themeName;
        $themeUrl = $colorFilePath;
        $FontSchemeUrl =  $FontFilePath;
        $BckImageUrl = $backGroundPath;
  
        ## Use seattle master if not provided
        $MasterPageUrl = $web.ServerRelativeUrl + "/_catalogs/masterpage/seattle.master";

        if ($colorFilePath)
        {
            $item["ThemeUrl"] = $themeUrl;
        }

        if ($fontFilePath)
        {
            $item["FontSchemeUrl"] = $FontSchemeUrl;
        }
 
        ## Use seattle master if not provided
        $item["MasterPageUrl"] = $MasterPageUrl;
        $item["DisplayOrder"] = 0;
        $item.Update()
        $spcontext.ExecuteQuery();
    }
    
}

function Apply-CustomTheme ([string] $url) {
      
    Write-Host -ForegroundColor Yellow " ------- About to apply a custom theme to: $url"
  
    $web = Get-PnPWeb   

    # Apply a custom theme to a Modern Site
    # First, upload the theme assets
    $targetDir = "/_catalogs/theme/15"    
    $file = Add-PnPFile -Path $currentDirectory"\Theme\KornFerry.spcolor" -Folder $targetDir
    $file = Add-PnPFile -Path $currentDirectory"\Theme\KornFerry.spfont" -Folder $targetDir
    
    # Second, apply the theme assets to the site
    $palette = $web.ServerRelativeUrl +$targetDir+"/KornFerry.spcolor"
    $font = $web.ServerRelativeUrl +$targetDir+"/KornFerry.spfont"

    #Register the theme on the Composed Looks list
    Create-ComposeLook $web $palette $font "KornFerry"

    Set-PnPTheme -ColorPaletteUrl $palette -FontSchemeUrl $font -ResetSubwebsToInherit
    
    Write-Output "-- Processed"
}


# -- end functions --


foreach($siteUrl in $sitesToProcess) {
	$authenticated = $false
	$ctx = $null
	try {

        #Write-Host -ForegroundColor Green "Connecting to Tenant to allow customize the destination site collection pages..." $siteUrl
        #Connect-PnPOnline -Url $tenantAdminUrl -Credentials $tenantCred
        #$site = Get-PnPTenantSite -Detailed -Url $siteUrl
        #This is required to add property bags to the modern sites sitecollection
        #if ($site.DenyAddAndCustomizePages -ne "Disabled") {
	    #    Write-Host -ForegroundColor Yellow " ------- Disabling customize pages"
	    #    $site.DenyAddAndCustomizePages = "Disabled"
	    #    $site.Update()
	    #    $site.Context.ExecuteQuery()
        #}

		Connect-PnPOnline -Url $siteUrl -Credentials $tenantCred
		Write-Host -ForegroundColor Yellow " ------- Authenticated to: $siteUrl"
		$ctx = Get-PnPContext

        if ($ctx) {
            
            
            ## Apply Custom Theme
            #Apply-CustomTheme $siteUrl

            Write-Host -ForegroundColor Yellow " ------- Registering or removing custom action for app extension..."
            
            ## Adds or remove the SPFx extension from the sitecollection		    
            if ($ActionToPerform -eq 0){

                $actionsToUpdate = Get-PnPCustomAction -Web $ctx.Web | Where-Object {$_.Location -eq "ClientSideExtension.ApplicationCustomizer" -and $_.Name -eq $spfxExtName };
                if($actionsToUpdate -eq $null) {

                    Write-Output "-- Adding Custom Action..." 	
		            Add-CustomActionForSPFxExt $siteUrl $ctx
                }
                else {

                    Write-Output "-- Updating Custom Action..." 	
                    Update-CustomActionForSPFxExt $spfxExtName $siteUrl $ctx
                }


            }
            elseif($ActionToPerform -eq 1) {
		        Remove-CustomActionForSPFxExt $spfxExtName $siteUrl $ctx
            } 
            
            # To Enable noscript again - Notice that we need to reconnect, since currently context is pointing to actual site, not admin site
            #Write-Host -ForegroundColor Yellow " ------- Enabling noscrint again on the destination site collection... "$siteUrl 
            #Write-host ""
            
            #Connect-PnPOnline -Url $tenantAdminUrl -Credentials $tenantCred
            #$site = Get-PnPTenantSite -Detailed -Url $siteUrl
            #if ($site.DenyAddAndCustomizePages -ne "Enabled") {
	        #    Write-Host "-- Disabling customize pages"
	        #    $site.DenyAddAndCustomizePages = "Enabled"
	        #    $site.Update()
	        #    $site.Context.ExecuteQuery()
            #}
        }
        
	}
	catch {
		Write-Error "Failed to authenticate to $site"
		Write-Error $_.Exception
	}
        
}

