import { h } from 'preact';
import { Card } from '../../atoms/Card/Card.js';

export const CompletedTab = () => (
  <Card class="p-8 text-center">
    <h3 class="text-lg font-medium mb-2">Under Maintenance</h3>
    <p class="text-muted-foreground">
      This section is currently under maintenance. Please check back later.
    </p>
  </Card>
);