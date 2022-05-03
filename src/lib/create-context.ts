import {
  FC,
  createElement,
  createContext as createReactContext,
  useContext as useReactContext,
  PropsWithChildren,
} from 'react';

/** Configuration needed in the createContext function. */
export type CreateContextConfig<T, R> = {
  /**
   * Hook to use in the provider, the arguments passed in the hook will be used as props in the
   * provider component returned in the `createProvider` function.
   */
  useValue: (providerProps: T) => R;
  /** Default values to use in the react context. */
  defaultValue?: R;
  /**
   * This component will be wrapped by the provider and will return the nested components needed to
   * use the hook. Example: The notification provider needs to show the notification at the top of
   * the root, use this component to pass the Notification component and the children.
   */
  Children?: FC<R>;
  /**
   * Wrapper to wrap th whole provider (Can be use to wrap the provider in another provider).
   */
  Wrapper?: FC;
};

/**
 * Function will create a provider component using react's `createContext` function. The values
 * return from the `useValue` callback function will be passed as the values of the provider and the
 * arguments will be used as the props for the component.
 */
const createContext = <T extends {}, R>(config: CreateContextConfig<T, R>) => {
  const { useValue: _useValue, Children, Wrapper, defaultValue } = config;

  const context = createReactContext(defaultValue ?? ({} as R));

  /** Hook will return the context values from the provider. */
  const useValue = () => useReactContext(context) as R;

  /** Component with provider and initial values calling the hook passed. */
  const Provider: FC<PropsWithChildren<T>> = ({ children, ...props }) => {
    const value = _useValue(props as T);

    if (!!Children)
      return createElement(context.Provider, { value }, createElement(Children, value, children));

    return createElement(context.Provider, { value }, children);
  };

  /**
   * Function will return the provider and the assign the `displayName` given (Usually the same as
   * the const name).
   */
  const createProvider = (displayName: string) => {
    if (!!Wrapper) {
      Wrapper.displayName = displayName + 'Wrapper';

      // Wrapper component.
      const ProviderWithWrapper: FC<PropsWithChildren<T>> = props =>
        createElement(Wrapper, undefined, createElement(Provider, props, props.children));

      ProviderWithWrapper.displayName = displayName;
      return ProviderWithWrapper;
    }

    Provider.displayName = displayName;
    return Provider;
  };

  return {
    useValue,
    createProvider,
    context,
  };
};

export default createContext;
