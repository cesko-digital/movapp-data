# ruby stories_transformer path_to_web_file

require 'json'

class Sentence
    def initialize(text, start, endTime)
        @text = text
        @start = start
        @end = endTime
    end
    
    def as_json(options={})
        {
            text: @text,
            start: @start,
            "end": @end
        }
    end

    def to_json(*options)
        as_json(*options).to_json(*options)
    end
end

class Sentences
    def initialize(cs, uk)
        @cs = cs
        @uk = uk
    end
    
    def as_json(options={})
        {
            cs: @cs,
            uk: @uk
        }
    end

    def to_json(*options)
        as_json(*options).to_json(*options)
    end
end

class Timeline
    def initialize(timeline)
        @timeline = timeline
    end
    
    def as_json(options={})
        {
            timeline: @timeline
        }
    end

    def to_json(*options)
        as_json(*options).to_json(*options)
    end
end

filePath = ARGV[0]
stringData = File.read filePath
data = JSON.parse(stringData)

output = Array.new

data.each do |item|
    object = Sentences.new(
        Sentence.new(item["main"], item["start_cs"], item["end_cs"]),
        Sentence.new(item["uk"], item["start_uk"], item["end_uk"])
    )
    
    output.append(object)
end

timeline = Timeline.new(output)

puts timeline.to_json

File.open("#{File.basename(filePath, ".*")}-transformed.json", "w") do |f|
    f.write(timeline.to_json)
end

puts "end"
