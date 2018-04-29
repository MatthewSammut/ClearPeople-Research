if($currentDirectory -eq 'null') { $currentDirectory = [System.IO.Path]::GetDirectoryName($MyInvocation.InvocationName) }

#Hub Site Parameters
$webUrl = "/";
#$siteUrl = "https://matthewsammut.sharepoint.com/";

$siteUrl = "https://matthewsammut.sharepoint.com/sites/ModernEssentials"