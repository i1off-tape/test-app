import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextTheme, getThemeColors } from '../dist/theme.js';

test('getNextTheme переключает темы между light и dark', () => {
  assert.equal(getNextTheme('light'), 'dark');
  assert.equal(getNextTheme('dark'), 'light');
});

test('getThemeColors возвращает корректную палитру для light темы', () => {
  const colors = getThemeColors('light');
  assert.equal(colors.background, '#f9fafb');
  assert.equal(colors.card, '#ffffff');
  assert.equal(colors.textPrimary, '#111827');
  assert.equal(colors.border, '#e5e7eb');
  assert.ok(colors.textSecondary);
  assert.ok(colors.tabBackground);
  assert.ok(colors.activeTabBackground);
});

test('getThemeColors возвращает корректную палитру для dark темы', () => {
  const colors = getThemeColors('dark');
  assert.equal(colors.background, '#111827');
  assert.equal(colors.card, '#1f2937');
  assert.equal(colors.textPrimary, '#f9fafb');
  assert.equal(colors.border, '#374151');
  assert.ok(colors.textSecondary);
  assert.ok(colors.tabBackground);
  assert.ok(colors.activeTabBackground);
});
