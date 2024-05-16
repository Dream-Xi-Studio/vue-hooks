#!/bin/sh

##提交前先获取最新代码
git pull

lastMessage=$(git status | tail -n 2)
##nothing to commit, working tree clean 本地没有变化
noCommit='nothing to commit'

if [[ $lastMessage =~ $noCommit ]]; then
  echo "无需提交"
  exit
fi

##将所有文件提交到暂存区
git add .

##输入提交的备注信息
read -p "Please enter the submitted remark information > " remark

##判断输入的值是否为空，为空则默认为“ok”
if [[ -z $remark ]]; then
  remark="ok"
fi

##提交到仓库
git commit -m $remark

##推送到git服务器
git push

##换行
printf "\n"

##提示
echo "更新完成"
