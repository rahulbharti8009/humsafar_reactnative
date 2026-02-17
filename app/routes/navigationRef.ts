import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../utils/types';

export const navigationRef = createNavigationContainerRef<{string: any}>();

let pendingNavigation: {
  name: any;
  params?: any;
} | null = null;
export function navigate(name:  any, params?: any
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    pendingNavigation = { name, params };
  }
}

export function flushPendingNavigation() {
  if (pendingNavigation && navigationRef.isReady()) {
    navigationRef.navigate(
      pendingNavigation.name,
      pendingNavigation.params
    );
    pendingNavigation = null;
  }
}
