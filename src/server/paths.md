- `/healthy`
  - GET: 
    - `200`
- `/configs`
  - GET: Query a list of existing participants and an ID for a potentially new participant to create.
    - Example: `curl http://localhost:3000/configs`
- `/participant/new`
  - GET: Returns reference for new user
- `/participant/:id`
  - `/config`
    - GET: Query configuration for an existing participant
      - Example: `curl http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/config`
    - POST: Creates config for a new user or replaces config for an existing user
      - Example: `curl --header "Content-Type: application/json" --request PUT --data '{"id": "p1","sketch": {"original": "../assets/sketch.json"},"transcript": {"original": "../assets/transcript.json"},"labels": {"original": "../assets/default-label-types.json"},"video": "../assets/video.mp4"}' http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/config`
  - `/labels`
    - GET: Query current version of label types and instances for user (throws error if not exists)
      - Example: `curl http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/labels`
    - POST: Update label document for user (throws error if user not exists --> see ./config)
      - Example: `curl --header "Content-Type: application/json" --request PUT --data '[{"id": "urn:sketch:label:object","name": "Objects","types": [{ "id": "urn:sketch:label:object:type:room", "name": "room" },{ "id": "urn:sketch:label:object:type:wall", "name": "wall" },{ "id": "urn:sketch:label:object:type:door", "name": "door" },{ "id": "urn:sketch:label:object:type:window", "name": "window" }],"instances": []},{"id": "urn:sketch:label:theme","name": "Cognitive Themes","types": [{ "id": "urn:sketch:label:theme:analysis", "name": "analysis" },{ "id": "urn:sketch:label:theme:synthesis", "name": "synthesis" },{ "id": "urn:sketch:label:theme:evaluation", "name": "evaluation" }],"instances": []}]' http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/labels`
  - `/transcript`
    - GET: Query latest version of edited transcript for user (throws error if not exists)
      - Example: `curl http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/transcript`
    - POST: Update transcript for user (throws error if user not exists --> see ./config)
      - Example: `curl --header "Content-Type: application/json" --request PUT --data '{"meta": {"speakers": [{ "id": "s1", "name": "Interviewer" },{ "id": "s2", "name": "Participant" }],"duration": 90000},"data": [{ "id": null, "text": "Loremipsum", "time": 0, "speaker": null },{ "id": null, "text": "dolor", "time": 0, "speaker": null }]}' http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/transcript`
  - `/sketch`
    - GET
      - Example: `curl http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/sketch`
    - POST: Update sketch for user ()
      - Example: `curl --header "Content-Type: application/json" --request PUT --data '[[{ "x": 5259, "y": 39131, "t": 1623053483525, "p": 456 },{ "x": 5258, "y": 39130, "t": 1623053483542, "p": 1531 },{ "x": 5257, "y": 39136, "t": 1623053483543, "p": 1753 },{ "x": 5256, "y": 39134, "t": 1623053483560, "p": 1792 }]]' http://localhost:3000/participant/urn:sketch:participant:1fbm30hpb/sketch`




