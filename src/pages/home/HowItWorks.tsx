import { HomeIcon } from './HomeIcon'
import { Step, StepIcon, Steps } from './home.styles'

export function HowItWorks() {
  return (
    <Steps id="how-it-works">
      <Step>
        <StepIcon>
          <HomeIcon name="pen" size={20} />
        </StepIcon>
        <h3>Describe your goal</h3>
        <p>Tell Mai what you want to learn — a topic, a skill, or a book you're working through.</p>
      </Step>
      <Step>
        <StepIcon>
          <HomeIcon name="layers" size={20} />
        </StepIcon>
        <h3>Get a structured outline</h3>
        <p>Mai organizes it into sections and lessons you can reshape into a path that fits you.</p>
      </Step>
      <Step>
        <StepIcon>
          <HomeIcon name="compass" size={20} />
        </StepIcon>
        <h3>Learn at your pace</h3>
        <p>Work through lessons, track progress, and pick up exactly where you left off.</p>
      </Step>
    </Steps>
  )
}
