import { useTranslation } from '@/app/i18n'
import { Brand, FooterInner, FooterRoot, Mark } from './HomeFooter.styles'
import { HomeIcon } from './HomeIcon'

export function HomeFooter() {
  const { t } = useTranslation('home')

  return (
    <FooterRoot>
      <FooterInner>
        <Brand to="/home">
          <Mark>
            <HomeIcon name="spark" size={18} />
          </Mark>
          Mai
        </Brand>
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
      </FooterInner>
    </FooterRoot>
  )
}
