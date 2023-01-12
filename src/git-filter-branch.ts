/*
# remove path from commit history
git filter-branch --force --index-filter "git rm -rf --cached --ignore-unmatch <relative_path_to_file>" --prune-empty --tag-name-filter cat -- --all

# reduce size
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# push
git push origin --force --all
*/
