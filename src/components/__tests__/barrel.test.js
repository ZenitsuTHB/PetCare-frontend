// Test para verificar que las exportaciones del barrel funcionan
import {
  EmptyState,
  PageHeader,
  ContentContainer,
  Footer,
  Header,
  ProvincePicker,
  WaveBackground,
} from '../index';

describe('components barrel exports', () => {
  it('debe exponer todos los componentes esperados', () => {
    const components = {
      EmptyState,
      PageHeader,
      ContentContainer,
      Footer,
      Header,
      ProvincePicker,
      WaveBackground,
    };

    Object.entries(components).forEach(([name, component]) => {
      expect(component).toBeDefined();
    });
  });
});
