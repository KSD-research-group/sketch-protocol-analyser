# Session Data

The data of a [labelling session](../readme.md#setup-or-load-session) are stored in the directory `data/[user-id]`. Editing is performed on copies of the [input files](../readme.md#prepare-data). The following explains which of the input files change during labelling, as well as when and how they change.

## Labels

The data in the [Label File](../readme.md#labels) `data/[user-id]/labels.json` changes in the following cases:

- A new label type is created
- A new label instance is created. This happens in two cases:
  - Text sections in the transcript are assigned to a label type
  - Graphic elements in the interactive visualisation of the sketch are assigned to a label type
- A label type or a label instance is removed by the user

The JSON object in `data/[user-id]/labels.json` is a list of `LabelGroup` objects that satisfy the following interface (in Typescript notation):

```typescript
interface LabelGroup {
  // Unique identifier for this group
  id: string;

  // Display name for this group
  name: string;

  // List of label instances associated with this group
  types: LabelType[];

  // List of label instances associated with this group
  instances: LabelInstance[];
}
```


`LabelType` objects satisfy the following interface:

```typescript
interface LabelType {
  // Unique identifier for this label type
  id: string;

  // Display name
  name: string;

  // True if user has set mute state ('-' toggle in label controls)
  muted: boolean;

  // True if user has set solo state ('+' toggle in label controls)
  solo: boolean;
}
```


`LabelInstance` objects satisfy the following interface:

```typescript
interface LabelType {
  // Unique identifier for this label instance
  id: string;

  // Display name
  name: string;

  // Unique identifier of the label type this label instance is associated with
  typeId: string;
  
  // True if user has set mute state ('-' toggle in label controls)
  muted: boolean;

  // True if user has set solo state ('+' toggle in label controls)
  solo: boolean;
}
```

## Sketch

The [sketch data](../readme.md#sketch) `data/[user-id]/sketch.json` changes in following cases:

- Graphic elements are assigned to a label type by the user
- Graphic elements are assigned to a label instance by the user
- A label type or a label instance associated with graphic elements in the sketch are removed by the user

The JSON object in `data/[user-id]/sketch.json` is a list of `Point` objects. The `Point` objects comply with the following interface:

```typescript
interface Point {
  // x position (position along the abscissa in a cartesian coordinate system)
  x: number;

  // y position (position along the ordinate in a cartesian coordinate system)
  y: number;

  // Pen pressure
  p: number;

  // Time stamp in miliseconds
  t: number;

  // List of label instance identifiers associated with this point
  labels: string[];
}
```

## Transcript

The [transcript files](../readme.md#transcript) `data/[user-id]/tap-transcript.json` and `data/[user-id]/retro-transcript.json` change in the following cases:

- A label type is assigned to a text section by the user
- A label instance is assigned to a text section by the user
- A label type or a label instance associated with a text section in the transcript are removed by the user

The JSON objects in `data/[user-id]/tap-transcript.json` and `data/[user-id]/retro-transcript.json` fulfil the following interface:

```typescript
interface Transcript {
  // Additional data on the transcript
  meta: MetaData;

  // List of words
  data: Word[];
}
```

`MetaData` objects comply with the following interface:

```typescript
interface MetaData {
  // Information on the speakers involved in the transcript
  speakers: Speaker[];
}
```

`Speaker` objects comply with the following interface:

```typescript
interface Speaker {
  // Unique identifier for the speaker
  id: string;

  // Display name of the speaker
  name: string;
}
```

`Word` objects comply with the following interface:

```typescript
interface Word {
  // Text content
  text: string,

  // Unique identifier of the speaker who said this word
  speaker: string,

  // Time in miliseconds at which this word was spoken
  time: number,

  // List of label instance identifiers associated with this point
  labels: string[]
}
```
