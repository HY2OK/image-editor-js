const fileInput = document.querySelector('.file-input')
const chooseImgBtn = document.querySelector('.choose-img')
const previewImg = document.querySelector('.preview-img img')
const filterName = document.querySelector('.filter-info .name')
const filterValue = document.querySelector('.filter-info .value')
const filterSlider = document.querySelector('.slider input')
const filterOptions = document.querySelectorAll('.filter button')
const rotateOptions = document.querySelectorAll('.rotate button')
const resetFilterBtn = document.querySelector('.reset-filter')
const saveImgBtn = document.querySelector('.save-img')

let rotate = 0,
    filpHorizontal = 1,
    flipVertical = 1

let brightness = 100,
    saturation = 100,
    inversion = 0,
    grayscale = 0

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${filpHorizontal}, ${flipVertical})`
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

const loadImage = () => {
    let file = fileInput.files[0]
    if (!file) return
    previewImg.src = URL.createObjectURL(file)
    previewImg.addEventListener('load', () => {
        resetFilterBtn.click()
        document.querySelector('.container').classList.remove('disable')
    })
}

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.filter .active').classList.remove('active')
        option.classList.add('active')

        filterName.innerText = option.innerText

        if (option.id === 'brightness') {
            filterSlider.max = '200'
            filterSlider.value = brightness
            filterValue.innerText = `${brightness}%`
        } else if (option.id === 'saturation') {
            filterSlider.max = '200'
            filterSlider.value = saturation
            filterValue.innerText = `${saturation}%`
        } else if (option.id === 'inversion') {
            filterSlider.max = '100'
            filterSlider.value = inversion
            filterValue.innerText = `${inversion}%`
        } else {
            filterSlider.max = '100'
            filterSlider.value = grayscale
            filterValue.innerText = `${grayscale}%`
        }
    })
})

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`
    const selectedFilter = document.querySelector('.filter .active')

    if (selectedFilter.id === 'brightness') {
        brightness = filterSlider.value
    } else if (selectedFilter.id === 'saturation') {
        saturation = filterSlider.value
    } else if (selectedFilter.id === 'inversion') {
        inversion = filterSlider.value
    } else {
        grayscale = filterSlider.value
    }
    applyFilters()
}

rotateOptions.forEach(option => {
    option.addEventListener('click', () => {
        if (option.id === 'left') {
            rotate -= 90
        } else if (option.id === 'right') {
            rotate += 90
        } else if (option.id === 'horizontal') {
            filpHorizontal = filpHorizontal === 1 ? -1 : 1
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1
        }
        applyFilters()
    })
})

const resetFilter = () => {
    rotate = 0
    filpHorizontal = 1
    flipVertical = 1

    brightness = 100
    saturation = 100
    inversion = 0
    grayscale = 0

    filterOptions[0].click()
    applyFilters()
}

const saveImage = () => {
    console.log('Save image btn clicked')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = previewImg.naturalWidth
    canvas.height = previewImg.naturalHeight

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    ctx.translate(canvas.width / 2, canvas.height / 2)
    if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180)
    }
    ctx.scale(filpHorizontal, flipVertical)
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

    const link = document.createElement('a')
    link.download = 'image.jpg'
    link.href = canvas.toDataURL()
    link.click()
}

fileInput.addEventListener('change', loadImage)
filterSlider.addEventListener('input', updateFilter)
resetFilterBtn.addEventListener('click', resetFilter)
saveImgBtn.addEventListener('click', saveImage)
chooseImgBtn.addEventListener('click', () => fileInput.click())
