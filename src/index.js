import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

**File 5: `.gitignore`**
In the root folder, create `.gitignore`:
```
node_modules
build
.DS_Store