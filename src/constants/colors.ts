export const colors = {
  light: {
    background: '#F2F2F7',
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundTertiary: '#E5E5EA',
    text: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    border: 'rgba(0,0,0,0.08)',
    borderMedium: 'rgba(0,0,0,0.15)',
    glass: 'rgba(255,255,255,0.72)',
    glassBorder: 'rgba(255,255,255,0.5)',
    glassBlurIntensity: 80,
    tabBarGlass: 'rgba(249,249,249,0.85)',
    tabBarBorder: 'rgba(0,0,0,0.06)',
  },
  dark: {
    background: '#000000',
    backgroundPrimary: '#1C1C1E',
    backgroundSecondary: '#000000',
    backgroundTertiary: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    border: 'rgba(255,255,255,0.08)',
    borderMedium: 'rgba(255,255,255,0.15)',
    glass: 'rgba(40,40,42,0.65)',
    glassBorder: 'rgba(255,255,255,0.1)',
    glassBlurIntensity: 60,
    tabBarGlass: 'rgba(30,30,30,0.75)',
    tabBarBorder: 'rgba(255,255,255,0.06)',
  },
};

export const phaseColors = {
  work: {
    gradient: ['#00C853', '#00BFA5'] as [string, string],
    solid: '#00C853',
    glowColor: 'rgba(0,200,83,0.25)',
  },
  rest: {
    gradient: ['#536DFE', '#7C4DFF'] as [string, string],
    solid: '#536DFE',
    glowColor: 'rgba(83,109,254,0.25)',
  },
  prepare: {
    gradient: ['#FF9100', '#FF6D00'] as [string, string],
    solid: '#FF9100',
    glowColor: 'rgba(255,145,0,0.25)',
  },
  restBetweenSets: {
    gradient: ['#448AFF', '#2979FF'] as [string, string],
    solid: '#448AFF',
    glowColor: 'rgba(68,138,255,0.25)',
  },
  cooldown: {
    gradient: ['#00B0FF', '#0091EA'] as [string, string],
    solid: '#00B0FF',
    glowColor: 'rgba(0,176,255,0.25)',
  },
  completed: {
    gradient: ['#AA00FF', '#D500F9'] as [string, string],
    solid: '#AA00FF',
    glowColor: 'rgba(170,0,255,0.25)',
  },
};

export const semantic = {
  accent: '#FF6B35',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  premium: '#FFD60A',
  streak: '#FF6B35',
};

export const colorThemes = [
  { id: 'vivid', name: 'Vivid', isPremium: false, work: ['#00C853', '#00BFA5'] as [string,string], rest: ['#536DFE', '#7C4DFF'] as [string,string], prepare: ['#FF9100', '#FF6D00'] as [string,string], cooldown: ['#00B0FF', '#0091EA'] as [string,string], restBetweenSets: ['#448AFF', '#2979FF'] as [string,string], completed: ['#AA00FF', '#D500F9'] as [string,string] },
  { id: 'ocean', name: 'Ocean', isPremium: false, work: ['#0288D1', '#0277BD'] as [string,string], rest: ['#1565C0', '#0D47A1'] as [string,string], prepare: ['#00ACC1', '#00838F'] as [string,string], cooldown: ['#4FC3F7', '#29B6F6'] as [string,string], restBetweenSets: ['#0288D1', '#0277BD'] as [string,string], completed: ['#1565C0', '#0D47A1'] as [string,string] },
  { id: 'sunset', name: 'Sunset', isPremium: false, work: ['#FF7043', '#F4511E'] as [string,string], rest: ['#AB47BC', '#8E24AA'] as [string,string], prepare: ['#FFA726', '#FB8C00'] as [string,string], cooldown: ['#EC407A', '#D81B60'] as [string,string], restBetweenSets: ['#AB47BC', '#8E24AA'] as [string,string], completed: ['#EC407A', '#D81B60'] as [string,string] },
  { id: 'neon', name: 'Neon', isPremium: true, work: ['#76FF03', '#64DD17'] as [string,string], rest: ['#E040FB', '#D500F9'] as [string,string], prepare: ['#FFEA00', '#FFD600'] as [string,string], cooldown: ['#18FFFF', '#00E5FF'] as [string,string], restBetweenSets: ['#E040FB', '#D500F9'] as [string,string], completed: ['#76FF03', '#64DD17'] as [string,string] },
  { id: 'midnight', name: 'Midnight', isPremium: true, work: ['#90CAF9', '#64B5F6'] as [string,string], rest: ['#CE93D8', '#BA68C8'] as [string,string], prepare: ['#FFCC80', '#FFB74D'] as [string,string], cooldown: ['#80DEEA', '#4DD0E1'] as [string,string], restBetweenSets: ['#CE93D8', '#BA68C8'] as [string,string], completed: ['#90CAF9', '#64B5F6'] as [string,string] },
  { id: 'forest', name: 'Forest', isPremium: true, work: ['#66BB6A', '#43A047'] as [string,string], rest: ['#5C6BC0', '#3F51B5'] as [string,string], prepare: ['#FFA726', '#FB8C00'] as [string,string], cooldown: ['#26A69A', '#00897B'] as [string,string], restBetweenSets: ['#5C6BC0', '#3F51B5'] as [string,string], completed: ['#66BB6A', '#43A047'] as [string,string] },
  { id: 'fire', name: 'Fire', isPremium: true, work: ['#FF5252', '#FF1744'] as [string,string], rest: ['#FF4081', '#F50057'] as [string,string], prepare: ['#FFD740', '#FFC400'] as [string,string], cooldown: ['#FF6E40', '#FF3D00'] as [string,string], restBetweenSets: ['#FF4081', '#F50057'] as [string,string], completed: ['#FF5252', '#FF1744'] as [string,string] },
  { id: 'arctic', name: 'Arctic', isPremium: true, work: ['#E0F7FA', '#B2EBF2'] as [string,string], rest: ['#E8EAF6', '#C5CAE9'] as [string,string], prepare: ['#FFF8E1', '#FFECB3'] as [string,string], cooldown: ['#E0F2F1', '#B2DFDB'] as [string,string], restBetweenSets: ['#E8EAF6', '#C5CAE9'] as [string,string], completed: ['#E0F7FA', '#B2EBF2'] as [string,string] },
  { id: 'mono', name: 'Monochrome', isPremium: true, work: ['#BDBDBD', '#9E9E9E'] as [string,string], rest: ['#757575', '#616161'] as [string,string], prepare: ['#E0E0E0', '#BDBDBD'] as [string,string], cooldown: ['#9E9E9E', '#757575'] as [string,string], restBetweenSets: ['#757575', '#616161'] as [string,string], completed: ['#BDBDBD', '#9E9E9E'] as [string,string] },
  { id: 'candy', name: 'Candy', isPremium: true, work: ['#F48FB1', '#EC407A'] as [string,string], rest: ['#CE93D8', '#AB47BC'] as [string,string], prepare: ['#FFF176', '#FFEE58'] as [string,string], cooldown: ['#80CBC4', '#4DB6AC'] as [string,string], restBetweenSets: ['#CE93D8', '#AB47BC'] as [string,string], completed: ['#F48FB1', '#EC407A'] as [string,string] },
];
