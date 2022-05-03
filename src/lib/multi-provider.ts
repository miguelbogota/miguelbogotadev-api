import { cloneElement, ReactElement, ReactNode } from 'react';

/**
 * Props for the MultiProvider component.
 */
export type ProviderProps = {
  /**
   * List of providers to stack in a single one. Keep in mind the order of the providers will affect
   * the order in which the component tree is generated.
   *
   * ```typescriptreact
   * <MultiProvider
   *   providers={[
   *     <FirstProvider />,
   *     <SecondProvider />,
   *     <LastProvider />,
   *   ]}
   * />
   * // The component above will generate:
   * <LastProvider>
   *   <SecondProvider>
   *     <FirstProvider />
   *   </SecondProvider>
   * </LastProvider>
   * ```
   */
  providers: ReactElement[];
  children: ReactNode;
};

/**
 * MultiProvider groups multiple providers into one avoiding scope-nesting hell.
 */
const MultiProvider = (props: ProviderProps) => {
  let content = props.children as ReactElement;

  // Turn object into an array.
  const numberOfProviders = props.providers.length;

  // If empty just return children.
  if (numberOfProviders === 0) return content;

  // Loop providers and use recursion to stack them.
  for (const provider of props.providers) content = cloneElement(provider, undefined, content);

  return content;
};

export default MultiProvider;
