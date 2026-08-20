import { useTranslation } from '@/app/i18n'
import { HomeIcon } from './HomeIcon'
import { Step, StepIcon, Steps } from './home.styles'

export function HowItWorks() {
  const { t } = useTranslation('home')
  return (
    <Steps id="how-it-works">
      <Step>
        <StepIcon>
          <HomeIcon name="pen" size={20} />
        </StepIcon>
        <h3>{t('howItWorks.step1.title')}</h3>
        <p>{t('howItWorks.step1.text')}</p>
      </Step>
      <Step>
        <StepIcon>
          <HomeIcon name="layers" size={20} />
        </StepIcon>
        <h3>{t('howItWorks.step2.title')}</h3>
        <p>{t('howItWorks.step2.text')}</p>
      </Step>
      <Step>
        <StepIcon>
          <HomeIcon name="compass" size={20} />
        </StepIcon>
        <h3>{t('howItWorks.step3.title')}</h3>
        <p>{t('howItWorks.step3.text')}</p>
      </Step>
    </Steps>
  )
}
