$file = 'd:\Desarrollo\Proyecto Necesidad de Cultivadores de Cannabis Medicinal\frontend\src\app\inventory\new\page.tsx'
$content = Get-Content $file -Raw
$content = $content -replace 'min-h-screen bg-gradient-to-br from-green-50 to-emerald-100', 'min-h-screen'
$content = $content -replace 'bg-white rounded-lg shadow-lg', 'bg-white dark:bg-gray-800 rounded-lg shadow-lg'
$content = $content -replace 'text-gray-800', 'text-gray-900 dark:text-white'
$content = $content -replace 'text-gray-700 font-semibold', 'text-gray-700 dark:text-gray-300 font-semibold'
$content = $content -replace 'border border-gray-300 rounded-lg', 'border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
$content = $content -replace 'bg-gray-200 text-gray-700', 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
$content = $content -replace 'bg-red-100 border border-red-400 text-red-700', 'bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400'
Set-Content $file -Value $content
