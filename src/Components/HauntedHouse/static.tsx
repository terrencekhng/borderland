import styles from "./index.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleDown, faAngleDoubleUp, faFaceSmileWink} from "@fortawesome/free-solid-svg-icons";

const StaticContent = () => {
  return (
    <div className={styles['list-container']} id='list-container'>
      <div className={styles['list-item']} id='list-item'>
        <h1>Haunted House</h1>
        <FontAwesomeIcon size='3x' bounce={true} icon={faAngleDoubleUp} />
        <section className={styles.section1}>
          <p>
            As you scroll up,
          </p>
          <p>
            The house will spin
          </p>
        </section>
        <section className={styles.section2}>
          <p>
            As you click the tombstone
          </p>
          <p>
            Something will pop up,
          </p>
          <p>
            Do you like it?
          </p>
        </section>
        <section className={styles.section3}>
          <p>
            Are you trying to click the 3rd one
          </p>
          <p>
            Oops,
          </p>
          <p>
            I forgot to tell you,
          </p>
          <p>
            There are only TWO working
          </p>
          <p>
            👻
          </p>
        </section>
        <section className={styles.section4}>
          <p>
            Are you enjoying the videos?
          </p>
          <p>
            YaY
          </p>
          <p>
            What about this one?
          </p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/9JHlO6cbedo"
                  title="YouTube video player" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen></iframe>
        </section>
        <section className={styles.section5}>
          <p>
            Cool!!!
          </p>
          <p>
            I love hiking
          </p>
          <p>
            This is why I like touring around
          </p>
          <p>
            This Haunted House
          </p>
        </section>
        <section className={styles.section6}>
          <FontAwesomeIcon size='3x' bounce={true} icon={faAngleDoubleDown} />
          <p>
            Want to learn more?
          </p>
        </section>
        <section className={styles.section7}>
          <p>
            I'm Terence
          </p>
          <p>
            HAPPY EXPLORING~
          </p>
          <FontAwesomeIcon size='3x' bounce={true} icon={faFaceSmileWink} />
        </section>
      </div>
    </div>
  )
}

export default StaticContent;
