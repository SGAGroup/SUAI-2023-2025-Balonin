param([String]$file)

<#
    README
    // balon begin
    starts balon block
    // balon end
    ends balon block
    // balon ignore
    ignores next line
#>

npx tsc --outDir out $file

$content = Get-Content -Path $("out/" + [System.IO.Path]::GetFileNameWithoutExtension($file) + ".js")

$result = ""

$is_balon_segment = $false
$ignore_count = 0
foreach ($line in $content -split "`r`n") {
    if ($line.Contains("// balon begin")) {
        $is_balon_segment = $true
        <# ignore comment #>
        $ignore_count += 1
    } elseif ($line.Contains("// balon end")) {
        $is_balon_segment = $false
    } elseif ($line.Contains("// balon ignore")) {
        $ignore_count += 2
    }

    if ($is_balon_segment -and $ignore_count -eq 0) {
        $result += $line + "`r`n"
    }
    
    if ($ignore_count -ne 0) {
        $ignore_count -= 1
    }
}

$result += '
    {{html
    <!DOCTYPE html>
    <head>
     <script SRC="http://livelab.spb.ru/x3d/three.min.js"></script>
     <script SRC="http://livelab.spb.ru/x3d/OrbitControls.js"></script>
    </head>
    html}}
'

Write-Output $result | clip
