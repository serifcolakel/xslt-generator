# Mastering `useImperativeHandle` in React (with TypeScript)

When building React applications with TypeScript, developers often encounter scenarios where they need to create custom, reusable components with advanced functionality. This article will explore two powerful concepts: the `useImperativeHandle` hook for fine-grained control over ref management, and the creation of custom components like Form Validation and Modal components.

We'll dive into:

1. The `useImperativeHandle` hook: What it does, when to use it, and how it allows you to customize the ref value that a parent component can access.
2. Creating a Form Validation Component: A practical example of building a reusable component with TypeScript for form validation.
3. Implementing a Modal Component: Another example showcasing how to create an interactive and reusable modal using TypeScript.

These examples will help beginners understand how to leverage TypeScript to build interactive and reusable components while also exploring advanced concepts like ref management. By the end of this article, you'll have a solid foundation for creating powerful custom components in your React applications.

# What is `useImperativeHandle`?

`useImperativeHandle` is a hook in React that allows you to customize the ref object that a parent component can access. This is useful when you want to expose a custom API to the parent component, rather than exposing the internal implementation details of your component.

# When and why you should use it

In most cases, `useRef` provides sufficient functionality for accessing DOM elements or component instances. However, `useImperativeHandle` steps in when you need more control, offering a way to expose only the methods or state you choose to the parent component. This ensures that your components stay modular, encapsulated, and easier to maintain. The hook also allows for better abstraction, meaning you can reuse components across your app with minimal repetition.

# Example 1 - Toggle Switch Component

This example demonstrates how to create a toggle switch component with TypeScript. The component uses `useImperativeHandle` to expose a custom API to the parent component, allowing the parent to control the switch state.

- Use Case: Creating a custom toggle switch component that can be controlled by the parent component.
- Implementation:
  - Define the component and use `useImperativeHandle` to expose a custom API.
  - Create a ref in the parent component and pass it to the ToggleSwitch component.
  - Use the ref to call the custom API and control the switch state.

```tsx
import React, { forwardRef, `useImperativeHandle`, useState } from "react";

interface ToggleRef {
  toggle: () => void;
  getState: () => boolean;
}

type ToggleSwitchProps = {
  initialState?: boolean;
};

const ToggleSwitch = forwardRef<ToggleRef, ToggleSwitchProps>((props, ref) => {
  const [isToggled, setIsToggled] = useState(props.initialState ?? false);

  `useImperativeHandle`(ref, () => ({
    toggle: () => setIsToggled(!isToggled),
    getState: () => isToggled,
  }));

  return (
    <motion.button
      onClick={() => setIsToggled(!isToggled)}
      className="flex items-center justify-start w-12 h-6 p-1 overflow-hidden bg-gray-300 rounded-full"
      animate={{
        backgroundColor: isToggled ? "#4CAF50" : "#f44336",
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex items-center justify-center w-5 h-5 bg-white rounded-full"
        animate={{
          x: isToggled ? "100%" : "0%",
        }}
        transition={{ type: "spring", stiffness: 700, damping: 100 }}
      ></motion.div>
    </motion.button>
  );
});

function Example() {
  const toggleRef = useRef<ToggleRef>(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <section className="flex flex-row items-center justify-center w-full py-4 border border-gray-200 rounded-md gap-x-4">
        <ToggleSwitch ref={toggleRef} />
        <button
          onClick={() => toggleRef.current?.toggle()}
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
        >
          Toggle Switch
        </button>
      </section>
    </div>
  );
}
```

# Example 2 - Accordion Component

This example demonstrates how to create an accordion component with TypeScript. The component uses `useImperativeHandle` to expose a custom API to the parent component, allowing the parent to control the accordion state.

- Use Case: Creating a custom accordion component that can be controlled by the parent component.
- Implementation:
  - Define the component and use `useImperativeHandle` to expose a custom API.
  - Create a ref in the parent component and pass it to the Accordion component.
  - Use the ref to call the custom API and control the accordion state.

```tsx
interface AccordionRef {
  expand: () => void;
  collapse: () => void;
  isExpanded: () => boolean;
  toggle: () => void;
}

type AccordionProps = {
  initialState?: boolean;
  title: string;
  content: ReactNode;
};

const Accordion = forwardRef<AccordionRef, AccordionProps>((props, ref) => {
  const [expanded, setExpanded] = useState(props.initialState ?? false);

  `useImperativeHandle`(ref, () => ({
    expand: () => setExpanded(true),
    collapse: () => setExpanded(false),
    isExpanded: () => expanded,
    toggle: () => setExpanded((prev) => !prev),
  }));

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-md w-ful">
      <motion.button
        className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200"
        onClick={handleToggle}
        initial={false}
        animate={{ backgroundColor: expanded ? "#e5e7eb" : "#f3f4f6" }}
      >
        {props.title}
      </motion.button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 bg-white">{props.content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function Example() {
  const accordionRef = useRef<AccordionRef>(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <main className="w-full px-4">
        <Accordion
          ref={accordionRef}
          title="Click to expand"
          content="This is the accordion content. It can contain any text or elements."
        />
      </main>
      <button
        onClick={() => {
          accordionRef.current?.expand();
        }}
        className="px-4 py-2 text-white bg-blue-500 rounded-md disabled:bg-gray-500"
      >
        Expand Accordion
      </button>
      <button
        onClick={() => accordionRef.current?.collapse()}
        className="px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        Collapse Accordion
      </button>
      <button
        onClick={() => accordionRef.current?.toggle()}
        className="px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        Toggle Accordion
      </button>
    </div>
  );
}
```

# Advantages of Using `useImperativeHandle`

`useImperativeHandle` provides some key benefits, especially when building reusable and interactive components:

1. Encapsulation
   By using `useImperativeHandle`, you can hide the internal implementation details of a component and expose only the methods you want the parent to interact with. This ensures that your component maintains its internal logic without being affected by external factors, making it more robust.

2. Fine-Grained Control
   It gives you fine-grained control over the ref object. Instead of exposing the whole component instance or DOM node, you decide what methods or values are available. This can be crucial when working with complex components like forms, toggles, or modals.

3. Increased Reusability
   By abstracting certain logic and controlling what’s exposed to the parent, your components can become more reusable. For example, a form validation component or a modal built with `useImperativeHandle` can easily be reused across multiple parts of your application with different configurations.

4. Clear API for Parent Components
   Instead of providing direct access to an entire component, you can create a clean, well-defined API for the parent component. This leads to fewer bugs and more predictable component behavior.

5. Better Type Safety in TypeScript
   With TypeScript, `useImperativeHandle` becomes even more powerful. You can define the exact methods and properties that the parent can use, improving type safety and ensuring that developers follow the intended API when working with your components.

# Conclusion

`useImperativeHandle` is a powerful hook that allows you to customize the ref object that a parent component can access. This is useful when you want to expose a custom API to the parent component, rather than exposing the internal implementation details of your component.

By using `useImperativeHandle`, you can create more flexible and powerful custom components that can be easily reused and customized by the parent component.

# Resources

- [React Docs - useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)
- [React Docs - forwardRef](https://react.dev/reference/react/forwardRef)
- [React Docs - useRef](https://react.dev/reference/react/useRef)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

Here is an example of a React component:

```tsx
import React from "react";
import ReactDOM from "react-dom";
function App() {
  return (
    <div>
      <h1>Hello World!</h1> <button onClick={() => {}}>Click Me</button>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
```

This component uses the `<h1>` element to display the text "Hello World!", and the `button` element to display a button that contains the onClick handler function. When the button is clicked, the handler function is called, which logs the message "Hello World!" to the console
