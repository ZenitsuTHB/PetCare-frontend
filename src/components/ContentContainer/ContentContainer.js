import React from 'react';
import { View, StyleSheet } from 'react-native';
import PageHeader from '../Headers/PageHeader';
import EmptyState from '../EmptyState/EmptyState';

const ContentContainer = ({
  title,
  subtitle,
  showEmptyState = false,
  emptyStateProps = {},
  children,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <PageHeader title={title} subtitle={subtitle} />

      {showEmptyState ? <EmptyState {...emptyStateProps} /> : children}
    </View>
  );
};

export default ContentContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
