import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { markedHighlight } from 'marked-highlight';
import { marked } from 'marked';

// Initialize marked with optional highlight if you want syntax highlighting
marked.use(
  markedHighlight({
    langPrefix: 'language-',
    highlight(code: string, lang: string) {
      // You could add a syntax highlighting library here like highlight.js
      return code;
    }
  })
);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
