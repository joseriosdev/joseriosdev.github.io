param(
    [string]$EnglishPath = 'docs/data/english.json',
    [string]$SpanishPath = 'docs/data/spanish.json'
)

$verbatimPathPatterns = @(
    '^basics\.(name|title|email|phone)$',
    '^basics\.location\.',
    '^basics\.profiles\.',
    '^basics\.spoken_languages\[\d+\]\.(language|proficiency|flag)$',
    '^skills\[\d+\]\.keywords\[\d+\]$',
    '^projects\[\d+\]\.tech_stack\[\d+\]$',
    '\.url$',
    '^work\[\d+\]\.(company|position)$',
    '^education\[\d+\]\.(institution|title|type)$'
)
$languageSpecificPaths = @('lang')

function Add-LeafValues($Node, [string]$Path, $Result)
{
    if ($Node -is [System.Management.Automation.PSCustomObject])
    {
        foreach ($property in $Node.PSObject.Properties)
        {
            $childPath = if ($Path) { "$Path.$($property.Name)" } else { $property.Name }
            Add-LeafValues $property.Value $childPath $Result
        }
    }
    elseif ($Node -is [System.Array])
    {
        for ($index = 0; $index -lt $Node.Count; $index++)
        {
            Add-LeafValues $Node[$index] "$Path[$index]" $Result
        }
    }
    else
    {
        $Result[$Path] = $Node
    }
}

function Get-LeafValues([string]$FilePath)
{
    $json = Get-Content -Raw -Encoding UTF8 -Path $FilePath | ConvertFrom-Json
    $leafValues = [ordered]@{}
    Add-LeafValues $json '' $leafValues
    return $leafValues
}

function Test-IsVerbatimPath([string]$Path)
{
    foreach ($pattern in $verbatimPathPatterns)
    {
        if ($Path -match $pattern) { return $true }
    }
    return $false
}

$englishValues = Get-LeafValues $EnglishPath
$spanishValues = Get-LeafValues $SpanishPath
$problemCount = 0

foreach ($path in $englishValues.Keys)
{
    if ($languageSpecificPaths -contains $path) { continue }

    if (-not $spanishValues.Contains($path))
    {
        Write-Output "MISSING        $path"
        $problemCount++
        continue
    }

    $englishValue = $englishValues[$path]
    $spanishValue = $spanishValues[$path]

    if (Test-IsVerbatimPath $path)
    {
        if ($englishValue -cne $spanishValue)
        {
            Write-Output "MUST MATCH     $path (en: $englishValue | es: $spanishValue)"
            $problemCount++
        }
    }
    elseif ($englishValue -is [string] -and $englishValue -ceq $spanishValue)
    {
        Write-Output "UNTRANSLATED?  $path ($englishValue)"
    }
}

foreach ($path in $spanishValues.Keys)
{
    if (-not $englishValues.Contains($path))
    {
        Write-Output "EXTRA          $path"
        $problemCount++
    }
}

if ($problemCount -gt 0)
{
    Write-Output "$problemCount structure problem(s) found."
    exit 1
}

Write-Output 'OK'
