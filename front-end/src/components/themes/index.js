function selectTheme(theme) {
    return {
        ...theme,
        colors: {
            ...theme.colors,
            primary25: '#ddd',
            primary: '#202020',
            primary50: '#ddd',
            primary75: '#202020'
        }
    }
}

export { selectTheme } 