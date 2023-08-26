package pl.fkozlicki.quizlet.studyset;

import java.util.List;

record MultipleChoice(
        String question,
        String answer,
        List<String> choices
) {}

record Written(
        String question,
        String answer
) {}

record TrueFalse(
        String question,
        String answer,
        String distractor
) {}

public record Test(
        List<MultipleChoice> multipleChoice,
        List<Written> written,
        List<TrueFalse> trueFalse
) {
}
