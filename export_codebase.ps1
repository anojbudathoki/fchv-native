$files = Get-ChildItem -Path src -Recurse -File | Where-Object { $_.Extension -in @('.ts', '.tsx', '.json', '.js') }
$rootFiles = Get-ChildItem -Path . -File -Depth 0 | Where-Object { $_.Name -in @('package.json', 'tsconfig.json', 'app.json', 'babel.config.js') }

$allFiles = @($rootFiles) + @($files)

$outputFile = "codebase.md"
Clear-Content $outputFile -ErrorAction SilentlyContinue

Add-Content $outputFile "# Codebase Overview`n`n"

foreach ($f in $allFiles) {
    # Determine code block language
    $lang = $f.Extension.Substring(1)
    if ($lang -eq "tsx") { $lang = "tsx" }
    elseif ($lang -eq "ts") { $lang = "typescript" }
    elseif ($lang -eq "js") { $lang = "javascript" }
    elseif ($lang -eq "json") { $lang = "json" }
    else { $lang = "text" }

    $relativePath = Resolve-Path -Relative $f.FullName
    
    Add-Content $outputFile "## File: $($relativePath)`n`n"
    Add-Content $outputFile "````$lang`n"
    
    try {
        $fileContent = Get-Content $f.FullName -Raw -ErrorAction Stop
        if ($fileContent) {
            Add-Content $outputFile $fileContent
        }
    } catch {
        Add-Content $outputFile "// Error reading file content."
    }
    
    Add-Content $outputFile "`n`````n`n"
}

Write-Host "Codebase exported to $outputFile"
