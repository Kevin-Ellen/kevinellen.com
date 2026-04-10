#!/usr/bin/env bash
echo "PWD=$(pwd)"
echo "Terraform files in working directory:"
find . -maxdepth 2 -name "*.tf" | sort

echo "PWD=$(pwd)"
echo "main.tf path:"
realpath ./main.tf
echo "variables.tf path:"
realpath ./variables.tf

echo
echo "deployments/dev/variables.tf contents:"
cat deployments/dev/variables.tf || true

echo
echo "stack root variables.tf contents:"
cat variables.tf || true

echo
echo "searching for photos_namespace_id in workspace:"
grep -R "photos_namespace_id" . || true



