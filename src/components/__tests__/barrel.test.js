// Test simple para verificar que las exportaciones funcionan
import {
  EmptyState,
  PageHeader,
  ContentContainer,
  Footer,
  Header,
  ProvincePicker,
  WaveBackground,
} from '../index';

// Verificar que todos los componentes se exportan correctamente
console.log('✅ Barrel exports working:');
console.log('EmptyState:', typeof EmptyState);
console.log('PageHeader:', typeof PageHeader);
console.log('ContentContainer:', typeof ContentContainer);
console.log('Footer:', typeof Footer);
console.log('Header:', typeof Header);
console.log('ProvincePicker:', typeof ProvincePicker);
console.log('WaveBackground:', typeof WaveBackground);
