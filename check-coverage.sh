#!/bin/bash
all_files_line=$(grep "All files" coverage-report.txt)
statements_pre_percentage=$(echo "$all_files_line" | awk -F'[|]' '{print $2}')
statements_percentage=$(echo "$statements_pre_percentage" | sed 's/ //g')

functions_pre_percentage=$(echo "$all_files_line" | awk -F'[|]' '{print $4}')
functions_percentage=$(echo "$functions_pre_percentage" | sed 's/ //g')

lines_pre_percentage=$(echo "$all_files_line" | awk -F'[|]' '{print $5}')
lines_percentage=$(echo "$lines_pre_percentage" | sed 's/ //g')

is_less_than_80() {
    local value=$1
    if (( $(echo "$value < 60" | bc -l) )); then
        return 0
    else
        return 1
    fi
}

# Проверка условий
if is_less_than_80 "$statements_percentage" && is_less_than_80 "$functions_percentage" && is_less_than_80 "$lines_percentage"; then
    echo "false"
    exit 1
else
    echo "true"
    exit 0
fi