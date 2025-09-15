import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import provinces from '../constants/provinces';

const ProvincePicker = ({ selectedProvince, onChange }) => {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedProvince}
        style={styles.picker}
        onValueChange={onChange}
      >
        {provinces.map((prov) => (
          <Picker.Item key={prov} label={prov} value={prov} />
        ))}
      </Picker>
    </View>
  );
};

export default ProvincePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    color: '#020618',
  },
});
