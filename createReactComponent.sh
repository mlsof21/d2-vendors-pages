#!/bin/bash

Help() {
  #Display Help
  echo "CreateReactComponent"
  echo
  echo "Syntax: createReactComponent.sh -n|--name {name} [-p|--page||-c|--component] [-h|--help]"
  echo "options:"
  echo "n     Set the name of the page/component being created"
  echo "p     Create a page"
  echo "c     Create a component"
  echo "h     Print this help"
}

tsxContents="import './{name}.scss';

const {name} = () => {
  return <>This is the {name} page</>;
}

export default {name};"

testContents="import { render, screen } from '@testing-library/react';
import {name} from './{name}';


describe('{name}', () => {
  it('render {name}', () => {
    render(<{name} />);
    const {lowername}Component = screen.getByText('This is the {name} page');

    expect({lowername}Component).toBeInTheDocument();
  });
});
"
while getopts "n:pch" option; do
    echo ${OPTARG}
    case $option in
        n) name=${OPTARG};;
        p) type="page";;
        c) type="component";;
        h) Help
           exit;;
        \?) #invalid
          echo "Invalid option"
          Help
          exit;;
    esac
done

basepath=""

case "$type" in
  page) basepath=./src/pages/$name;;
  component) basepath=./src/components/$name;;
  "") echo "Can't determine if creating page or component. Exiting."
      exit ;;
esac

mkdir -p $basepath
touch $basepath/$name.tsx
touch $basepath/$name.test.tsx
touch $basepath/${name,,}.scss

echo "${tsxContents//\{name\}/"$name"}" > $basepath/$name.tsx

testContents="${testContents//\{lowername\}/"$(tr [:lower:] ${name:0:1}")${name:1}"
echo "${testContents//\{name\}/"$name"}" > $basepath/$name.test.tsx