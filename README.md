# Getting started

It is recommended that you use git in terminal to help learn git patterns before you use any GUI so that when you eventually use GUI you understand the underlying operations. Its simple
Whenever I refer to `remote` I am refering to the github repository, whenever I use `local` I am refering to your local dev repository. If your unfamiliar with git I strongly advise reading this whole document (IK its alot) but git is only complicated if we let it get complicated and messy. 

I personally like to think of git like a menu at a resturant, all the chefs prepare and tweak new dishes without altering the main menu. They only add them to the menu when they are finished and approved by the manager. If two chefs tweak the same dish they work together to combine the flavors properly so that when the dish is added to the menu there isn't a conflict of flavors.

Also DON'T USE REBASE for this project we will be using Merge only. Any questoins? Want me to add more? Just say the word documentation is fun to write. 

## Important Commands

Displays the commit history the later shows a condesened preview `git log` & `git log --oneline`

Displays the state of your current branch `git status`

Displays the list of all branches `git branch`

See below how to use git stash to save changes without commiting `git stash` & `git stash pop`

## Terminal Config
Gitbash

In terminal enter `nano ~/.bashrc`

Add `source /etc/profile.d/git-prompt.sh` to the top of the file Ctrl-o to save and Ctrl-x to exit and restart terminal

Powershell (default vscode)

In terminal enter `Install-Module posh-git -Scope CurrentUser -Force` and follow prompts

Enter `Add-PoshGitToProfile -AllHosts` and restart terminal

## Naming Branches
Your branch name should tell any developer immediately what your working and where. Use the naming convetion `feature/<insert-name-here>` and for bugs use `bug/<insert-name-here>` note that feature/ does not mean a directory it is apart of the branch name string and is standard practice. For spaces use `-` no underscores as it is the standard. Branch names should be concise and denote specific things about the what your working on. Below are some general rules and examples and rules.

```
1. If your working on specific component include component in the branch name
2. If your working on a View include view
- View is a design pattern (not a defined thing in react) used in react projects to describe a component the 
encapsulates UI components and/or other views. 
- For example in our project Search View would have all the selection components required to search. 
And it is nested in the wider view Home View which has Search View and Advanced Options View
3. Don't use underscores _ use hyphens 

Implementing sort functionallity on the results page
feature/result-sort-component
Fixing bug in the hotel popup page that causes the page to crash
bug/hotel-popup-crash

```


## How to save your work

### Commit
Before getting started ensure that what your currently working on is properly saved. 
You can check this by using `git status` from the list of changes use `git add file/path` to stage your changes for commit, note that the path is relative from where you are. You can also use but not recommended `git add .` to add every change showed in git status. Then commit your changes using your favorite method personally I use `git commit -m "Commit Message"` allows you to commit inline instead of a text editor. You can also use multiple lines by `git commit -m "Line 1" -m "Line 2"` or by leaving the the ending quote off of `git commit -m "Line 1` your terminal will then prompt you for the next line you can enter as many as you want just use a `"` to end your message. Commit should explain what you changed not the story description. So don't say "Implemented Search with selectors that etc" say verbatim what you added "Added Search View, Added Text Field Component, Added styling for prexisting component, Updated branch from main etc" Include core things to help other devs in the future when they look at `git log`
### Stash
If you don't want to commit your work but still want access to it later on, use `git stash` this will store all your changes in a stash and revert your current branch to its last commit. To view the stash use `git stash show -p`. To bring your changes back use `git stash apply` to apply the first entry in the stash otherwise use `git stash apply stash@{Enter #}` note these commands still keep your changes in your stash which isn't good the more you use it. Using pop instead of apply will remove the changes from your stash like so `git stash pop` and `git stash pop stash@{Enter #}`

## Creating Dev Branch
1. Follow the steps above to ensure all your work is properly saved
2. Checkout main branch `git checkout main`
3. Update main branch from remote `git pull origin main` note that if you have local commits not pushed to the remote see the section about updating your branches below.
4. Create your new branch `git checkout -b <feature/short-desc>` this will automatically switch you to the new branch. Note follow naming convetions mentions above. 

## Uploading Dev Branch
1. Stage and commit your changes
2. If this is your first time pushing your branch to remote you need to link it to remote. Using `git push -u origin <Branch-name>`
3.  If you have already linked your local branch to remote in the future just use `git push`

## Updating Dev Branch from main
1. Stage and commit any changes before you update your branch
2. Checkout and Update main `git checkout main` and `git pull origin main` respectively
3. Checkout your feature branch `git checkout <feature/rest-of-name-here>`
4. Bring in the changed from main `git merge main`
5. If there is conflicts (multiple edits to the same file) you will have to resolve them in the merge conflict editor of whatever software your using there is no benifit to doing this in terimanl only pain
6. Once all your conflicts are resolved and the functionality works, follow the instructions for Uploading Dev Branch to upload your updated branch to the remote repo.

## How to Merge Dev Branch into main
1. MAKE SURE you have already updated your dev branch from main before continuing
2. Push your feature branch to origin as explained above, after pushing there will be a link "Create a pull request for" that link will take you to pull request page this can also be reached by the Github website
3. Create a Pull Request and fill out the information
4. Im unsure how PRs work on github will update the rest of this after I PR this readme.md