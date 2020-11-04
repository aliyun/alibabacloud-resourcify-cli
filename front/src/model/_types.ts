export class ProductItem {
  [key: string]: string | ProductItem;
}

export class TreeItem {
  'title': string;
  'key': string;
  'icon'?: any;
  'children'?: TreeItem[];
}

export class ContentDataItem {
  'actions': Map<string, string>;
  'resources': Map<string, string>;
  'name': string;
  'syntax': string[];
  'desc': string;
  'options': Map<string, Map<string, string>>;
}
