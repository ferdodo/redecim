interface ObservableValue<T> {
  get(): T;
  set(value: T): void;
  observe(observer: (value: T) => void): () => void;
}

export function createObservableValue<T>(initialValue: T): ObservableValue<T> {
  let value = initialValue;
  const observers = new Set<(value: T) => void>();

  return {
    get(): T {
      return value;
    },
    set(newValue: T): void {
      value = newValue;
      for (const observer of observers) {
        observer(value);
      }
    },
    observe(observer: (value: T) => void): () => void {
      observers.add(observer);
      observer(value);
      return (): void => {
        observers.delete(observer);
      };
    },
  };
}
