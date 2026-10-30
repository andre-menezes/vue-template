export interface Metric {
  label: string;
  value: string | number;
  detail: string;
  icon: string;
  color: string;
}

export interface Activity {
  title: string;
  detail: string;
  icon: string;
  color: string;
}

export interface Dependency {
  name: string;
  version: string;
}
