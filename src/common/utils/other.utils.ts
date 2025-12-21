import { matchPath } from 'react-router-dom';
import { Route } from '../../router/route.interface';

export const calculatePageAndIndex = (
  urlIndex: number,
  urlPage: number,
  urlTake: number,
  currentTake: number = 10,
): { page: number; index: number } => {
  // Nếu take từ URL bằng take hiện tại, giữ nguyên page và index
  if (urlTake === currentTake) {
    return {
      page: urlPage,
      index: urlIndex,
    };
  }

  // Tính toán vị trí tuyệt đối của item trong danh sách
  // Vị trí = (page - 1) * itemsPerPage + index
  const absolutePosition = (urlPage - 1) * urlTake + urlIndex;

  // Tính toán page mới dựa trên take hiện tại
  const newPage = Math.floor(absolutePosition / currentTake) + 1;

  // Tính toán index mới trong page mới
  const newIndex = absolutePosition % currentTake;

  return {
    page: newPage,
    index: newIndex === 0 ? currentTake : newIndex, // Nếu index = 0 thì là item cuối cùng của page trước
  };
};

export const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const objectToStyleInline = (styleObj: Record<string, any>): string => {
  return Object.entries(styleObj)
    .map(([key, value]) => `${camelToKebabCase(key)}:${value}`)
    .join(';');
};

export const camelToKebabCase = (str: string) => {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};

export const getLimitLineCss = (line: number): any => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: line,
  // textOverflow: 'ellipsis',
});

export interface RouteMatch {
  route: Route;
  fullPath: string;
}

export const findRouteFromPathName = (routes: Route[], pathname: string, parentPath = ''): RouteMatch | null => {
  for (const route of routes) {
    const currentPath = parentPath + route.path.replace(/\/$/, '') + (route.path.endsWith('/') ? '' : '/');

    if (route.path === '/' && pathname !== '/') {
      if (matchPath({ path: route.path, end: true }, pathname)) return { route, fullPath: route.path };

      continue;
    }

    const matched = matchPath({ path: currentPath, end: false }, pathname);
    if (!matched) continue;

    if (route.children) {
      const childMatch = findRouteFromPathName(route.children, pathname, currentPath);
      if (childMatch) return childMatch;
    }

    if (matchPath({ path: currentPath, end: true }, pathname)) return { route, fullPath: currentPath };

    return { route, fullPath: currentPath };
  }

  return null;
};
