# details of sites
[string[]] $sitesToProcess = #$null
	#"https://matthewsammut.sharepoint.com/sites/TestModernCommunitySite",
	"https://matthewsammut.sharepoint.com/sites/ModernEssentials"
  
# tenant admin
[string] $tenantAdminUrl = 'https://matthewsammut-admin.sharepoint.com';
[string] $tenantUserName = 'admin@matthewsammut.onmicrosoft.com';
[string] $tenantPassword = 'Qweid!snqiw0';


#Sample Theme
$SampleCustomThemeSample = @{
"themePrimary" = "#3ad600";
"themeLighterAlt" = "#f4fff0";
"themeLighter" = "#e9ffe1";
"themeLight" = "#d4ffc4";
"themeTertiary" = "#a4ff83";
"themeSecondary" = "#41f400";
"themeDarkAlt" = "#33c100";
"themeDark" = "#289600";
"themeDarker" = "#1f7600";
"neutralLighterAlt" = "#ececec";
"neutralLighter" = "#e8e8e8";
"neutralLight" = "#dedede";
"neutralQuaternaryAlt" = "#cfcfcf";
"neutralQuaternary" = "#c6c6c6";
"neutralTertiaryAlt" = "#bebebe";
"neutralTertiary" = "#d6d6d6";
"neutralSecondary" = "#474747";
"neutralPrimaryAlt" = "#2e2e2e";
"neutralPrimary" = "#333333";
"neutralDark" = "#242424";
"black" = "#1c1c1c";
"white" = "#f1f1f1";
"primaryBackground" = "#f1f1f1";
"primaryText" = "#333333";
"bodyBackground" = "#f1f1f1";
"bodyText" = "#333333";
"disabledBackground" = "#e8e8e8";
"disabledText" = "#bebebe";
"accent" = "#0072d6"
}