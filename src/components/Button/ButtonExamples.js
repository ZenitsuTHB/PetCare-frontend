import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './Button';

// Ejemplos de uso del componente Button
const ButtonExamples = () => {
  return (
    <View style={styles.container}>
      {/* 1. Botón principal - Acción primaria */}
      <Button
        title="Nueva mascota"
        variant="primary"
        size="medium"
        iconName="add"
        iconPosition="left"
        onPress={() => console.log('Agregar mascota')}
        fullWidth
      />

      {/* 2. Botón secundario - Acción secundaria */}
      <Button
        title="Ver detalles"
        variant="secondary"
        size="medium"
        onPress={() => console.log('Ver detalles')}
      />

      {/* 3. Botón outline - Acción menos importante */}
      <Button
        title="Cancelar"
        variant="outline"
        size="medium"
        onPress={() => console.log('Cancelar')}
      />

      {/* 4. Botón ghost - Acción sutil */}
      <Button
        title="Omitir"
        variant="ghost"
        size="small"
        onPress={() => console.log('Omitir')}
      />

      {/* 5. Botón de peligro - Acciones destructivas */}
      <Button
        title="Eliminar mascota"
        variant="danger"
        size="medium"
        iconName="delete"
        iconPosition="left"
        onPress={() => console.log('Eliminar')}
      />

      {/* 6. Botón con loading */}
      <Button
        title="Guardando..."
        variant="primary"
        size="medium"
        loading={true}
        onPress={() => console.log('Guardando')}
      />

      {/* 7. Botón deshabilitado */}
      <Button
        title="Iniciar sesión"
        variant="primary"
        size="medium"
        disabled={true}
        onPress={() => console.log('Login')}
      />

      {/* 8. Botón solo icono */}
      <Button
        variant="ghost"
        size="small"
        iconName="favorite"
        iconPosition="only"
        iconSize={24}
        onPress={() => console.log('Like')}
      />

      {/* 9. Botón de navegación con icono derecho */}
      <Button
        title="Siguiente"
        variant="primary"
        size="medium"
        iconName="arrow-forward"
        iconPosition="right"
        onPress={() => console.log('Siguiente')}
      />

      {/* 10. Botón personalizado */}
      <Button
        title="Personalizado"
        variant="primary"
        size="large"
        style={{ backgroundColor: '#4CAF50', borderRadius: 25 }}
        textStyle={{ fontSize: 18, fontWeight: 'bold' }}
        onPress={() => console.log('Personalizado')}
      />
    </View>
  );
};

export default ButtonExamples;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    backgroundColor: '#FFF8F4',
  },
});
