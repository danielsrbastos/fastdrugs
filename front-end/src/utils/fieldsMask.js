const telefoneMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{1})(\d{1})/, '($1$2) ')
        .replace(/(\d{4})(\d{1,4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
}

const celularMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{1})(\d{1})/, '($1$2) ')
        .replace(/(\d{5})(\d{1,4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
}

const cepMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d{1,3})/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
}

const cnpjMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,4})/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})(\d)/, '$1')
}

const cpfMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
}

const kmMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{1,4})/, '$1 km')
        .replace(/(\D{2})\d+?$/, '$1')
}

const reaisMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d)/, 'R$ $1')
        .replace(/(\d{1,2})(\d{2})/, '$1,$2')
        .replace(/(\d{2})\d+?$/, '$1')
}

const horaMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{2})/, '$1:$2')
        .replace(/(\D)(\d{2})/, '$1$2h')
        .replace(/([h])(\d{1})/, '$1')
}

const dataMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})\d+?$/, '$1')
}

export { telefoneMask, celularMask, cepMask, cnpjMask, cpfMask, kmMask, reaisMask, horaMask, dataMask }